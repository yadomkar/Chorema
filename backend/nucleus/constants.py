# constants.py or within models.py

STATUS_PENDING = 'Pending'
STATUS_IN_PROGRESS = 'In Progress'
STATUS_COMPLETED = 'Completed'
STATUS_CANCELLED = 'Cancelled'

STATUS_CHOICES = (
    (STATUS_PENDING, 'Pending'),
    (STATUS_IN_PROGRESS, 'In Progress'),
    (STATUS_COMPLETED, 'Completed'),
    (STATUS_CANCELLED, 'Cancelled'),
)
