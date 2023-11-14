import boto3
import json


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('TICKET')

    payload = json.loads(event['body'])

    table.put_item(
        Item={
            'ticket_id': str(payload['ticket-id']),
            'user_id': str(payload['user-id']),
            'reason': str(payload['reason']),
            'datetime': payload['datetime'],
            'user': payload['user'],
            'process': payload['process']
        }
    )

    if 'ticket-detail-viewed' in event['headers']:
        log_critical_event(table, payload['ticket-id'], 'ticket Detail Viewed')

    if 'user-detail-viewed' in event['headers']:
        log_critical_event(table, payload['ticket-id'], 'User Detail Viewed')

    return {
        'statusCode': 200,
        'body': json.dumps('Ticket stored successfully')
    }


def log_critical_event(table, ticket_id, event_type):
    table.put_item(
        Item={
            'ticket_id': str(ticket_id),
            'event_type': event_type
        }
    )
