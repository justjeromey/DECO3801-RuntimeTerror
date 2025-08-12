# Rolling Hills Backend

I acquired the geodatabase from QSpatial and loaded it using Fionas.

Then I opened the data with geopandas.

To set up a virtual environment using Conda and an environment YAML file:

1. **Install Conda**  
    Download and install [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or [Anaconda](https://www.anaconda.com/products/distribution) if you don't have it already.

2. **Create the Environment**  
    In your project directory (where `environment.yml` is located), run:
    ```bash
    conda env create -f environment.yml
    ```

3. **Activate the Environment**  
    ```bash
    conda activate <env_name>
    ```

4. **Update the Environment (if needed)**  
    If the `environment.yml` changes, update your environment with:
    ```bash
    conda env update -f environment.yml
    ```
