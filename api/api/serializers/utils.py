"""
    This module is made of utility function used to build serializers
"""

from typing import Any, Callable, Optional

from rest_framework import serializers


def create_instance(class_serializer: Any, data: dict[str, str], object_name: str) -> Any:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data = data.pop(object_name)
    serializer = class_serializer(data=object_data)

    if serializer.is_valid():
        return serializer.create(object_data)
    return None


def get_instance(class_serializer: Callable, data_id: Optional[str], instance_class: Any) -> dict[str, str]:
    """get a single instance of a Class from object, using a serializer's validated_data"""
    if data_id is None:
        return {}
    obj = instance_class.objects.get(pk=data_id)
    return class_serializer(read_only=True, many=False, data=obj).data
