from typing import List, Any

""" This module is made of utility function used to build serializers
"""

def create_instance(Class: Any, data: dict[str, str], object_name: str, or_get: bool = False) -> Any:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data = data.pop(object_name)
    if or_get:
        created_object, create = Class.objects.get_or_create(**object_data)
    else:
        created_object = Class.objects.create(**object_data)
    return created_object


def create_mutiple_instances(Class: Any, data: dict[str, str], object_name: str) -> List[Any]:
    """create multiple instances of a Class from an object, using a serializers's validated_data"""
    result = []
    object_data = data.pop(object_name)
    for o in object_data:
        created_object = Class.objects.create(**object_data)
        result.append(created_object)
    return result
