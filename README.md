## About

In the Spring 2025 semester, I attended the Data Structures and Algorithms lab at LAU. As part of our final project, we had the opportunity to build a full-stack application and as a team, we chose to create something practical and impactful for our campus community.

**ByteTracker** is a full-stack website designed to help students at LAU Byblos easily report and retrieve lost items. Whether it’s a misplaced laptop or a forgotten textbook, ByteTracker makes it simple to log, search, and recover belongings through a user-friendly interface tailored to campus life.

## features

![Figure 1: Home Page](images/picture11.png)

![Figure 1: Home Page](images/picture12.png)

### Report "lost" items

Users can easily report items they've lost by submitting a detailed entry that includes the item's description, last known location, picture (optional) and time of loss. These entries are added to the "Lost" pool, making them searchable and increasing the chances of recovery through community awareness.

![Figure 2: Report Lost Page](images/picture3.png)

### Report "Found" Items

When someone finds an item that appears to be lost, they can log it into the system with relevant details such as photo, location found, date of finding it, and a description of the item adding them to the "Found" pool. This shared database helps match lost items with their rightful owners.

![Figure 3: Report Found Page](images/picture2.png)

### Search for "Lost/Found" Belongings

The platform features a powerful search tool that allows users to filter by location, date, and keywords. Whether you're trying to find your own item or return one you've found, the search makes it fast and intuitive.

![Figure 4: Found Page](images/picture4.png)
![Figure 4: Lost Page](images/picture5.png)

### Help Return "Lost" Items to Their Owners

Once a match is made, ByteTracker facilitates secure communication between the finder and the owner via the registered email. This ensures a safe and respectful exchange while protecting user privacy.

## How to Run

### Step 1 Install Python

- Go to the official Python website.
- Download and install the latest version for your operating system.
- Important: During the installation process, ensure to check the box to add Python to your PATH (this will make Python accessible globally from the command line).
- After installation, verify by running the following command in your terminal/command prompt:

python --version

This should display the installed Python version.

### Step 2 Install Visual Studio Code (VSCode)

- Download and install Visual Studio Code from the official website.
- Launch VSCode after installation.
- Open VSCode.
- Go to the Extensions view (click the Extensions icon in the Activity Bar on the side of the window).
- In the search bar, type Python.
- Select the extension named Python (by Microsoft) and click Install.
- Open your Python project or create a new file with .py extension.
- Press Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (Mac) to open the command palette.
- Type Python: Select Interpreter and press Enter.
- Choose the Python interpreter you installed
- click Ctrl+Shift+P and type "create environment", choose venv then enter.

### Step 3

- Download postgresql from this link: https://www.postgresql.org/download/windows/ click on "Download the installer" and download the latest version.
- installing postgresql: https://youtu.be/4qH-7w5LZsA?si=DL0dY9YieMy_pS5y follow this video

### Step 4: open the code

Open the code in VSCode.

### Step 5: in VS code terminal:

- type: pip install fastapi
- type: pip install uvicorn
- type: pip install sqlalchemy
- type: pip install psycopg2-binary
- type: pip install python-multipart
- type: pip install passlib[bcrypt]
- type: pip install pydantic

### Step 6

To access the database, search in your windows search bar for "pgAdmin 4" and open it.
The password that you set during the installation should be used
In the Object explorer menu (at the left), underneath Servers, right click on Databases --> Create --> Database...
Name your database "dataprjct"
In the bar menu at the top, click on properties and see what you are named as Owner (usually it is "postgres")
Finally, in database.py change DATABASE_URL into this format: postgresql://your_username(owner):your_password@localhost/dataprjct

### Step 7

To run the code in VS code terminal type: uvicorn test:app --reload and open on your browser http://127.0.0.1:8000/docs

## Conclusion

This project offers university students a secure and reliable platform to easily find and return their lost belongings.
Whether it’s a textbook, wallet, or laptop, students can report lost items, search for found items, and connect with others in a safe and efficient way.

**PS: Stay tuned for updates, we’re just getting started**
