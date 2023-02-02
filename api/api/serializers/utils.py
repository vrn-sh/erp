"""
    This module is made of utility function used to build serializers
"""

from typing import Any


def create_instance(class_serializer: Any, data: dict[str, str], object_name: str) -> Any:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data = data.pop(object_name)
    serializer = class_serializer(data=object_data)

    if serializer.is_valid():
        return serializer.create(object_data)
    return None
