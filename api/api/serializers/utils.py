"""
    This module is made of utility function used to build serializers
"""

from django.db.models import Model
from rest_framework.serializers import ModelSerializer, Serializer
from typing import Any, Callable, List, Optional, OrderedDict


def create_instance(
        class_serializer: Serializer,
        data: dict[str, str],
        object_name: str,
        ) -> Model:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data: dict[str, str] = data.pop(object_name)
    serializer: Serializer = class_serializer(data=object_data)

    if serializer.is_valid():
        return serializer.create(object_data)
    return None


def get_instance(
        class_serializer: Serializer,
        data_id: Optional[str],
        instance_class: Model
        ) -> OrderedDict[Any, Any]:
    """get a single instance of a Class from object, using a serializer's validated_data"""
    if data_id is None:
        return {}
    obj = instance_class.objects.get(pk=data_id)
    return class_serializer(read_only=True, many=False, data=obj).data


def get_serialized(class_serializer: ModelSerializer, ids: List[int], obj_type: Model) -> Serializer:
    """Serialize mutlitple object from a list of id"""

    objects = []
    for i in ids:
        obj = obj_type.objects.get(pk=i)
        objects.append(obj)

    # now, we serialize this
    sr: Serializer = class_serializer(objects, many=True)
    return sr


def get_multiple_instances(
        data: OrderedDict[str, Any],
        object_name: str,
        model: Model,
        ) -> List[Model]:
    """create a list of objects from their """

    object_data: List[OrderedDict[str, Any]] = data.pop(object_name)
    objects: List[Model] = []

    for o in object_data:
        model.objects.get_or_create(**o)
        objects.append(model)

    return objects
