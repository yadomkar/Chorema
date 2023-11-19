from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Group, Chore, Transaction, Debt

User = get_user_model()


class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class GroupSerializer(serializers.ModelSerializer):
    # members = serializers.PrimaryKeyRelatedField(
    #     queryset=User.objects.all()
    # )
    # members = serializers.ListField(
    #     child=serializers.EmailField()
    # )

    class Meta:
        model = Group
        fields = ['id', 'group_name', 'members', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChoreSerializer(serializers.ModelSerializer):
    assigned_to = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='email',
        required=False,
        allow_null=True
    )
    group = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all()
    )

    class Meta:
        model = Chore
        fields = ['id', 'name', 'description', 'karma_value', 'group', 'assigned_to', 'is_recurring', 'created_at',
                  'due_date', 'completed_at', 'status']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        return Chore.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.karma_value = validated_data.get('karma_value', instance.karma_value)
        instance.group = validated_data.get('group', instance.group)
        instance.assigned_to = validated_data.get('assigned_to', instance.assigned_to)
        instance.is_recurring = validated_data.get('is_recurring', instance.is_recurring)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.completed_at = validated_data.get('completed_at', instance.completed_at)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance


# class TransactionSerializer(serializers.Serializer):
#     # from_user = serializers.SlugRelatedField(
#     #     queryset=User.objects.all(),
#     #     slug_field='email'
#     # )
#     # to_user = serializers.SlugRelatedField(
#     #     queryset=User.objects.all(),
#     #     slug_field='email'
#     # )
#     karma = serializers.DecimalField(max_digits=10, decimal_places=2)
#     created_at = serializers.DateTimeField(read_only=True)


class TransactionSerializer(serializers.Serializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class DebtSerializer(serializers.Serializer):
    class Meta:
        model = Debt
        fields = '__all__'
