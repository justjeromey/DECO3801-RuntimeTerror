"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function FileSelector({ setTrailData }) {
  const acceptedFileTypes = ".gpx";
  const [trails, setTrails] = useState<Array<string>>([]);
  const [toggled, setToggle] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Grab default trails on load
    async function fetchTrails() {
      try {
        const res = await toast.promise(fetch("/api/fileReader"), {
          pending: "Fetching trails",
          success: "Trails successfully fetched",
          error: "Failed to retrieve default trails",
        });
        const files = await res.json();
        if (files) {
          setTrails(files);
        }
      } catch (error) {
        return;
      }
    }

    fetchTrails();
  }, []);

  // Toggles the dropdown menu
  function handleDropdown() {
    setToggle(!toggled);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdown.current &&
        !dropdown.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    }

    if (toggled) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggled]);

  const postForm = async (formData: FormData) => {
    setToggle(!toggled);
    try {
      if (pending) {
        return;
      }
      setPending(true);
      const res = await toast.promise(
        fetch("/api/parser", {
          method: "POST",
          body: formData,
        }),
        {
          pending: "Uploading file...",
          success: "File uploaded.",
          error: "Failed to upload selected file",
        }
      );

      // Get json data and pass to parent
      const result = await res.json();
      if (result) {
        setPending(false);
      }

      setTrailData(result);
    } catch (error) {
      console.error(`File upload failed ${error}`);
    }
  };

  // Loads the selected file and sends file to parser
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    if (!file) return;
    formData.append("file", file);

    setSelected(file.name);

    // Send request to parser
    postForm(formData);
  };

  // Handles trail selection, sends request to parser
  const handleSelection = async (trail: string) => {
    const formData = new FormData();
    formData.append("fileName", trail);
    setSelected(trail);
    // Send request to parser
    postForm(formData);
  };

  return (
    <div ref={dropdown} className="md:min-w-50 relative z-10">
      <button
        type="button"
        className={`fileSelector ${
          toggled ? `rounded-t-lg` : `rounded-lg`
        } hover:brightness-125`}
        onClick={handleDropdown}
      >
        {selected === "" ? "Select Trail" : selected}
      </button>

      <button
        type="button"
        className="fileSelector_icon"
        onClick={handleDropdown}
      >
        <Image src="/menu.svg" width={50} height={50} alt="Burger Menu" />
      </button>

      <div
        className={`border w-full max-h-[50vh] p-1 gap-2 flex flex-col bg-accent-2 border-secondary rounded-b-lg overflow-scroll ${
          toggled ? `absolute` : `hidden`
        }`}
      >
        <input
          type="file"
          id="file-upload-label"
          accept={acceptedFileTypes}
          className="hidden"
          onChange={handleUpload}
        />
        <label
          className="text-center italic file_select_button"
          htmlFor="file-upload-label"
        >
          Upload .gpx file
        </label>
        {trails.map((trail: string, key: number) => (
          <button
            key={key}
            type="button"
            className="file_select_button"
            onClick={() => handleSelection(trail)}
          >
            {trail}
          </button>
        ))}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
        toastClassName="burnt_toast"
      />
    </div>
  );
}
