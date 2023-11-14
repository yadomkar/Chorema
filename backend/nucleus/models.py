import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, AbstractUser

from .constants import STATUS_CHOICES, STATUS_PENDING


class UserProfileManager(BaseUserManager):
    """ Manager for user profiles """

    def create_user(self, email, first_name, last_name, password=None):
        """Create a new user profile"""
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password):
        """Create and return a new superuser with given details."""
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserProfile(AbstractUser):
    """ Database model for users in system """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserProfileManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self) -> str:
        """Retrieve full name of user"""
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self) -> str:
        """Retrieve short name of user"""
        return self.first_name

    def __str__(self) -> str:
        return f"Email: {self.email}, Name: {self.get_full_name()}"


class Debt(models.Model):
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='from_user')
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='to_user')
    karma = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.to_user.first_name} owes {self.karma} to {self.from_user.first_name}'


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group_name = models.CharField(max_length=255, unique=True)
    debts = models.ManyToManyField(Debt, blank=True)
    members = models.ManyToManyField(UserProfile)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Chore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    karma_value = models.DecimalField(max_digits=10, decimal_places=2)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="chores")
    assigned_to = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)

    def __str__(self):
        return f"{self.name} (Karma: {self.karma_value})"


class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    karma_value = models.DecimalField(max_digits=10, decimal_places=2)
    group = models.ForeignKey(Group, on_delete=models.DO_NOTHING, null=True, db_constraint=False)
    users_involved = models.ManyToManyField(UserProfile, through='TransactionParticipant')
    chore = models.ForeignKey(Chore, on_delete=models.SET_NULL, null=True, blank=True)
    is_paid = models.BooleanField(default=False)
    settlements = models.ManyToManyField(Debt)


class TransactionParticipant(models.Model):
    """Represents a user's karma earnings or losses in a specific transaction."""

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    karma_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    karma_owed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    note = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.net_balance = self.karma_earned - self.karma_owed
        super(TransactionParticipant, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.first_name} earned {self.karma_earned} karma points"
