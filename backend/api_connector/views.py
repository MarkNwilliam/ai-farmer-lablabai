from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import JsonResponse
import json

from .ai_chat_handler import process_ai_chat
from .ai_analysis import process_csv_with_langchain

def connect_api(request):
    # Here you would add logic for connecting to the actual API
    return JsonResponse({"status": "connected", "message": "Ready for analysis"})

def ready_view(request):
    return JsonResponse({"message": "Ready for analysis"})

@csrf_exempt 
def aichat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_input = data.get('message')

        # Call the process_ai_chat function
        ai_response = process_ai_chat(user_input)

        return JsonResponse({"message": ai_response})
    else:
        return JsonResponse({"error": "This endpoint only supports POST requests."})

import os
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
def analysis(request):
    if request.method == 'POST':
        # Check if there's a file in the request
        if 'file' not in request.FILES:
            return JsonResponse({"error": "No file provided"}, status=400)

        uploaded_file = request.FILES['file']
        prompt = request.POST.get('prompt')
        description = request.POST.get('description')

        # Ensure temp_files directory exists
        temp_dir = 'temp_files'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        temp_file_path = os.path.join(temp_dir, uploaded_file.name)

        # Save the uploaded file temporarily
        with open(temp_file_path, 'wb+') as temp_file:
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)

        # Process the file with langchain
        try:
            ai_response = process_csv_with_langchain(temp_file_path, prompt, description)
        finally:
            # Clean up: Remove the temporary file
            os.remove(temp_file_path)

        return JsonResponse({"message": ai_response})
    else:
        return JsonResponse({"error": "This endpoint only supports POST requests."}, status=405)
