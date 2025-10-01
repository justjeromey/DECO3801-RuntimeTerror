import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import os

def convert_to_gpx(input_file, output_filename="output.gpx"):
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, output_filename)

    # Create GPX root
    gpx = ET.Element("gpx", version="1.1", creator="GNSS Converter",
                     xmlns="http://www.topografix.com/GPX/1/1")

    trk = ET.SubElement(gpx, "trk")
    trkseg = ET.SubElement(trk, "trkseg")

    with open(input_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line.startswith("Fix,"):
                continue  # skip everything else

            parts = line.split(",")

            try:
                lat = float(parts[2])
                lon = float(parts[3])
                ele = float(parts[4])
                t_ms = int(parts[8])

                # Convert Unix ms → ISO 8601 UTC
                time_str = datetime.fromtimestamp(t_ms / 1000, tz=timezone.utc).isoformat()

                trkpt = ET.SubElement(trkseg, "trkpt", lat=str(lat), lon=str(lon))
                ET.SubElement(trkpt, "ele").text = str(ele)
                ET.SubElement(trkpt, "time").text = time_str
            except Exception:
                continue  # skip malformed rows

    # Write GPX
    tree = ET.ElementTree(gpx)
    tree.write(output_file, encoding="utf-8", xml_declaration=True)