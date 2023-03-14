"""
    This module is made of utility function used to build serializers
"""

from typing import Any, List

from rest_framework.serializers import Serializer


def create_instance(class_serializer: Any, data: dict[str, str], object_name: str) -> Any:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data: dict[str, str] = data.pop(object_name)
    serializer: Serializer = class_serializer(data=object_data)

    if serializer.is_valid():
        return serializer.create(object_data)
    return None

def create_multiple_instances(
        class_serializer: Any,
        data: dict[str, str],
        object_name: str
        ) -> List[Any]:
    """creates multiple instances of a Class from an object, using a serializers's validated_data"""
    object_data: List[dict[str, str]] = data.pop(object_name)

    created_objects = []
    for o in object_data:
        serializer: Serializer = class_serializer(data=o)

        if serializer.is_valid():
            obj = serializer.create(o)
            created_objects.append(obj)
        else:
            for to_del in obj:
                to_del.delete()
            return None

    return created_objects
