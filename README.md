# DECO3801-RuntimeTerror
Runtime Terror Team Repository for DECO3801 Team

Repository: https://github.com/justjeromey/DECO3801-RuntimeTerror

Live: https://runtimeterror.uqcloud.net/

# About
This project is for Runtime Timmer's DECO3801 Project. Trailrunners is a web application to detect "rolling hills" in 
trail running tracks.

# Installation

## Prerequisites
Ensure you have the following installed on your laptop:
1. **Python (and PIP).**
2. **Node.js (and NPM). NPM is preferred, but other JavaScript package managers like yarn are also suitable.**
3. **(Optional and Recommended) NPM's "Concurrently"**
4. **(Optional and Recommended) Bash**

## Manual Installation

### Front-End
To install the TrailRunners Next.js front-end follow the following procedures:

1. **Go into the trailrunners directory and install all of the packages.**

```bash 
cd trailrunners
npm install
```

### Back-End
To install the TrailRunners Python FastAPI back-end scripts follow the following procedures:

1. **Create the Python Environment (In Root Directory)**  
    ```bash
    python -m venv .venv
    ```

2. **Activate the Environment (In Root Directory)**  
    ```bash
    .venv\Scripts\activate
    ```

3. **Install the Requirements (In backend Directory)**  
    ```bash
    pip install -r requirements.txt
    ```

## Automatic Installation
For future updating of commands you may use the following command to update all dependencies in both the back-end and front-end contexts. 
This can also be used for first-time installation, however, this method using concurrently to install for first-time use can potentially 
be volatile and may not fully install the application correctly.

```bash 
npm run install-all
```

# Updating Requirements

When updating any requirements for the front-end, like adding new packages, ensure these commands are being executed within the trailrunners directory.

1. **Adding a new npm package (In trailrunners Directory)**
    ```bash
    npm install <package_name>
    ```

When updating any requirements for the back-end, you can either do it manually via editing the "requirements.txt" file and running:

2. **Manual Python Package Installation (In the backend Directory)**
    ```bash
    pip install -r requirements.txt
    ```

Or, if you have installed any requirements into the virtual environment you should use:

3. **Virtual Environment Python Package Installation (In the backend Directory)**
```bash
pip freeze > requirements.txt
```

To ensure any requirements stored in a virtual environment are carried over to the actual requirements file.

# Start-up

## Automatic
To start-up the application (back-end and front-end simultaneously) you can use our custom concurrently command within the "trailrunners" directory:

```bash
npm run all
```

This command should run both the back-end and front-end environments at the same time in one terminal locally. This web application will then be available on [http://localhost:3000] for use, or as otherwise suggested by the console when the front-end is started up. The back-end server will also be running on [http://127.0.0.1:8000].

Alternatively, you can use the "start.sh" script to run both back-end and front-end environments simultaneously on Linux environments.

## Manual
Otherwise, if there are any issues with the automatic start-up command, you will need to have two separate to terminals open to run both the back-end server and front-end server.

1. **To run the front-end environment (In the trailrunners directory)**  
    ```bash
    npm run dev
    ```

2. **To run the back-end environment (Starting in Root directory)**  
    ```bash
    .venv\Scripts\activate
    cd backend
    uvicorn main:app --reload
    ```

## Zones Setup
Ensure that the main repository is set up for the "nodejs" directory. Ensure you have npm (+ concurrently installed inside of the trail runners directory) and Python
/ Pip installed.

### Front-end
In "trailrunners"

```bash
npm install
npm run build
```

### Back-end
In root (nodejs)

```bash
python3 -m venv .venv
source .venv/bin/activate
cd backend
pip3 install -r requirements.txt
```

### Reloading

```bash
webprojctl enable nodejs
```

# Usage

To use the application, ensure you have .gpx files to submit which contains your trail data for analysis. The web application has its own 
tutorials to assist you in the collection of your GPX data. For additional refinement of your data, it is also recommended to have LiDAR
files (.laz) of the location in which your GPX data is within. 

For use, ensure you are at the "Trail Summary" Page to submit your trail running track for analysis. And enjoy!

# Thanks and Acknowledgements
Thank you, dear user, for using and supporting this application.

We would like to acknowledge the DECO3801 staff, along with our tutor Shubh Gupta and our mentor Raimundo Sanchez, for assisting us in the development of TrailRunners.

And a special thank you and acknowledgement to the team who developed this application: 

- Daniel Fuller (B ComputerScience / M CyberSec)
- Lliam Symonds (B Computer Science)
- Michael Gormley (B Computer Science)
- Yi-Tao (Etao) Tsai (B Computer Science)
- Zach Adams (B Engineering(Hons))
- Jerome Rillera (B Information Tech / B Arts)
