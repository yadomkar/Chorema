# Generated by Django 4.2.6 on 2023-10-12 05:19

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chore',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('karma_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_recurring', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Pending', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Debt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('karma', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('group_name', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('debts', models.ManyToManyField(blank=True, to='nucleus.debt')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('karma_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_paid', models.BooleanField(default=False)),
                ('chore', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='nucleus.chore')),
                ('group', models.ForeignKey(db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='nucleus.group')),
                ('settlements', models.ManyToManyField(to='nucleus.debt')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TransactionParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('karma_earned', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('karma_owed', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('net_balance', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('note', models.TextField(blank=True, null=True)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nucleus.transaction')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nucleus.userprofile')),
            ],
        ),
        migrations.AddField(
            model_name='transaction',
            name='users_involved',
            field=models.ManyToManyField(through='nucleus.TransactionParticipant', to='nucleus.userprofile'),
        ),
        migrations.AddField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(to='nucleus.userprofile'),
        ),
        migrations.AddField(
            model_name='debt',
            name='from_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_user', to='nucleus.userprofile'),
        ),
        migrations.AddField(
            model_name='debt',
            name='to_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_user', to='nucleus.userprofile'),
        ),
        migrations.AddField(
            model_name='chore',
            name='assigned_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='nucleus.userprofile'),
        ),
        migrations.AddField(
            model_name='chore',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chores', to='nucleus.group'),
        ),
    ]
