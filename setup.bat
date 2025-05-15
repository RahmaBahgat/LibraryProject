@echo off
echo Setting up your development environment...

:: Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate

:: Install requirements
pip install -r requirements.txt

:: Navigate to project directory
cd onlinelibrary

:: Run migrations
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