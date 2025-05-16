from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def help_center(request):
    return render(request, 'help/help.html')