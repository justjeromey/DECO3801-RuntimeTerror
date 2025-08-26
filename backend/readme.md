# Rolling Hills Backend


## Installation
1. **Create the Environment**  
    ```bash
    python -m venv .venv
    ```

2. **Activate the Environment**  
    ```bash
    .venv\Scripts\activate
    ```

3. **Install the Requirements**  
    ```bash
    pip install -r requirements.txt
    ```
## Usage

**Updating Requirements**
    When installing new packages with pip, updating the requirements
    ```bash
    pip freeze > requirements.txt
    ```

    ## Running the FastAPI Server

    To start the FastAPI server, run:

    ```bash
    cd backend
    uvicorn main:app --reload
    ```

    - The server will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).