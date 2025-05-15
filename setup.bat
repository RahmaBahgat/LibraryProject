@echo off
echo Setting up your development environment...

:: Check if requirements.txt exists, if not create it
if not exist requirements.txt (
    echo Creating requirements.txt...
    pip freeze > requirements.txt
)

:: Check if venv already exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate

:: Install requirements
echo Installing requirements...
pip install -r requirements.txt

:: Navigate to project directory
cd onlinelibrary

:: Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

:: Create superuser (optional)
echo.
echo You can now create a superuser (admin) account.
echo If you want to skip this step, press Ctrl+C
echo.
python manage.py createsuperuser

echo.
echo Setup complete! You can now run the server with:
echo cd onlinelibrary
echo python manage.py runserver 