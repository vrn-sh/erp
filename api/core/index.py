import pusher

pusher_client = pusher.Pusher(
    app_id='1759644',
    key='8704037a23dad6569f48',
    secret='e3f03562b2286605f92f',
    cluster='eu',
    ssl=True
)
print("oui index")
pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})
