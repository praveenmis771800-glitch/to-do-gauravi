import json
import boto3
from decimal import Decimal
from datetime import datetime

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'TodoList'  # Change this to your table name

def lambda_handler(event, context):
    """
    Main Lambda handler for To-Do List operations
    Supports: GET (list), POST (create), PUT (update), DELETE (delete)
    """
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    }
    
    # Handle OPTIONS request for CORS
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        table = dynamodb.Table(table_name)
        method = event['httpMethod']
        
        if method == 'GET':
            # List all tasks
            response = table.scan()
            items = response.get('Items', [])
            
            # Convert Decimal to float for JSON serialization
            items = convert_decimals(items)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'tasks': items
                })
            }
        
        elif method == 'POST':
            # Create new task
            body = json.loads(event['body'])
            
            task_id = body.get('id', str(int(datetime.now().timestamp() * 1000)))
            task_text = body.get('text', '')
            
            if not task_text:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Task text is required'
                    })
                }
            
            item = {
                'id': task_id,
                'text': task_text,
                'completed': body.get('completed', False),
                'createdAt': body.get('createdAt', datetime.now().isoformat())
            }
            
            table.put_item(Item=item)
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'task': convert_decimals(item)
                })
            }
        
        elif method == 'PUT':
            # Update task
            body = json.loads(event['body'])
            task_id = body.get('id')
            
            if not task_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Task ID is required'
                    })
                }
            
            update_expression = 'SET '
            expression_values = {}
            
            if 'text' in body:
                update_expression += 'text = :text, '
                expression_values[':text'] = body['text']
            
            if 'completed' in body:
                update_expression += 'completed = :completed, '
                expression_values[':completed'] = body['completed']
            
            # Remove trailing comma and space
            update_expression = update_expression.rstrip(', ')
            
            response = table.update_item(
                Key={'id': task_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_values,
                ReturnValues='ALL_NEW'
            )
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'task': convert_decimals(response.get('Attributes', {}))
                })
            }
        
        elif method == 'DELETE':
            # Delete task
            body = json.loads(event['body'])
            task_id = body.get('id')
            
            if not task_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({
                        'success': False,
                        'error': 'Task ID is required'
                    })
                }
            
            table.delete_item(Key={'id': task_id})
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'message': 'Task deleted successfully'
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Method not allowed'
                })
            }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }

def convert_decimals(obj):
    """Convert Decimal types to float for JSON serialization"""
    if isinstance(obj, list):
        return [convert_decimals(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_decimals(value) for key, value in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    else:
        return obj
