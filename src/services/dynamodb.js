import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'MyQuest-DailyData';
const USER_ID = 'vishesh@tracker'; // Single user for now

export const saveDayData = async (date, data) => {
  const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
  
  try {
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        userId: USER_ID,
        date: dateKey,
        ...data,
        savedAt: new Date().toISOString()
      }
    }));
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error };
  }
};

export const loadDayData = async (date) => {
  const dateKey = date.toISOString().split('T')[0];
  
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
        date: dateKey
      }
    }));
    return result.Item || null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const getAllData = async () => {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': USER_ID
      }
    }));
    return result.Items || [];
  } catch (error) {
    console.error('Error loading all data:', error);
    return [];
  }
};

export const getPerfectDaysCount = async () => {
  const allData = await getAllData();
  return allData.filter(day => day.stats?.isPerfectDay).length;
};

export const getTotalEarnings = async () => {
  const allData = await getAllData();
  return allData.reduce((total, day) => total + (day.stats?.totalEarnings || 0), 0);
};
