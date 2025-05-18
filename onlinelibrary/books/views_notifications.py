from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q
from .models import Notification

def is_admin(user):
    return user.is_staff

@login_required
def user_notifications(request, get_latest=False):
    """View for users to see their notifications"""
    # For regular users: show personal notifications and system notifications
    notifications = Notification.objects.filter(
        Q(recipient=request.user) |  # Personal notifications
        Q(notification_type='global') |  # Global announcements
        Q(notification_type__in=['book_borrowed', 'book_returned'], recipient=request.user)  # Book-related notifications
    ).order_by('-created_at')
    
    if get_latest:
        # Return only the latest 5 notifications as JSON
        latest_notifications = notifications[:5]
        return JsonResponse({
            'notifications': [{
                'id': notif.id,
                'message': notif.message,
                'created_at': notif.created_at.isoformat(),
                'is_read': notif.is_read,
                'type': notif.notification_type
            } for notif in latest_notifications]
        })
    
    return render(request, 'notifications.html', {
        'notifications': notifications
    })

@user_passes_test(is_admin)
def admin_notifications(request):
    """View for admins to see all notifications and send new ones"""
    if request.method == 'POST':
        notification_type = request.POST.get('notification_type')
        title = request.POST.get('title')
        message = request.POST.get('message')
        recipient_id = request.POST.get('recipient')

        if not title or not message:
            messages.error(request, 'Title and message are required.')
            return redirect('admin-notifications')

        if notification_type == 'personal':
            if not recipient_id:
                messages.error(request, 'Recipient is required for personal notifications.')
                return redirect('admin-notifications')
            try:
                recipient = User.objects.get(id=recipient_id)
                Notification.send_personal_notification(
                    sender=request.user,
                    recipient=recipient,
                    title=title,
                    message=message
                )
                messages.success(request, f'Personal notification sent to {recipient.username}')
            except User.DoesNotExist:
                messages.error(request, 'Selected user does not exist.')
                return redirect('admin-notifications')
        
        elif notification_type == 'global':
            Notification.send_global_notification(
                sender=request.user,
                title=title,
                message=message
            )
            messages.success(request, 'Global notification sent successfully')

    # For admins: show all notifications including book-related ones
    notifications = Notification.objects.filter(
        Q(sender=request.user) |  # Notifications sent by this admin
        Q(recipient=request.user) |  # Notifications received by this admin
        Q(notification_type__in=['book_added', 'book_edited', 'book_removed', 'book_borrowed', 'book_returned'])  # Book-related notifications
    ).order_by('-created_at')
    
    users = User.objects.filter(is_staff=False)  # Get non-staff users for recipient selection
    
    return render(request, 'notifications-admin.html', {
        'notifications': notifications,
        'users': users
    })

@login_required
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id)
        # Allow marking as read if user is recipient or it's a global notification
        if notification.recipient == request.user or notification.notification_type == 'global':
            notification.is_read = True
            notification.save()
            return JsonResponse({'status': 'success'})
    except Notification.DoesNotExist:
        pass
    return JsonResponse({'status': 'error'}, status=400) 