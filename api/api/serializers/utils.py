"""
    This module is made of utility function used to build serializers
"""

import base64
import re
from django.db.models import Model
from rest_framework.serializers import ModelSerializer, Serializer
from typing import Any, List, Optional, OrderedDict


def create_instance(
        class_serializer: Serializer,
        data: dict[str, str],
        object_name: str,
        ) -> Model:
    """create a single instance of a Class from an object, using a serializers's validated_data"""
    object_data: dict[str, str] = data.pop(object_name)  # type: ignore
    serializer: Serializer = class_serializer(data=object_data)  # type: ignore

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
        return {}  # type: ignore
    obj = instance_class.objects.get(pk=data_id)  # type: ignore
    return class_serializer(read_only=True, many=False, data=obj).data  # type: ignore


def get_serialized(class_serializer: ModelSerializer, ids: List[int], obj_type: Model) -> Serializer:
    """Serialize mutlitple object from a list of id"""

    objects = []
    for i in ids:
        obj = obj_type.objects.get(pk=i)  # type: ignore
        objects.append(obj)

    # now, we serialize this
    sr: Serializer = class_serializer(objects, many=True)  # type: ignore
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
        model.objects.get_or_create(**o)  # type: ignore
        objects.append(model)

    return objects


def get_image_data(content: str) -> Optional[bytes]:
    """Strips the MIME type information from image data"""
    as_base64 = content.split('base64,')
    if len(as_base64) != 2:
        return None

    as_base64 = as_base64[1]
    from_base64 = base64.b64decode(as_base64)
    return from_base64

def get_mime_type(content: str) -> Optional[str]:
    """Get MIME type from the start of an image file"""

    pattern = re.compile('data:(.*);base64')
    if pattern.match(content):
        rg_search = pattern.search(content)
        if not rg_search:
            return None

        content_type = rg_search.group(0)
        if not content_type.startswith('data:image/'):
            return None

        image_type = content_type.split('/')[1].split(';', 1)[0]
        allowed_filetype = ['jpg', 'jpeg', 'png', 'gif']

        if image_type not in allowed_filetype:
            return None
        return image_type
    return None
