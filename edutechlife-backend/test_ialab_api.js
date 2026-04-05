// Test script for IALab API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testIALabAPI() {
    console.log('🧪 Testing IALab API endpoints...\n');
    
    try {
        // Test 1: Generate a prompt
        console.log('1. Testing prompt generation...');
        const promptResponse = await axios.post(`${BASE_URL}/api/ialab/prompts`, {
            template: 'general',
            userInput: 'Create a marketing plan for a new AI tool',
            userId: 'test-user-123'
        });
        console.log('✅ Prompt generation successful');
        console.log('   Response:', promptResponse.data.slice(0, 100) + '...\n');
        
        // Test 2: Save progress
        console.log('2. Testing progress saving...');
        const progressResponse = await axios.post(`${BASE_URL}/api/ialab/progress`, {
            userId: 'test-user-123',
            moduleId: 1,
            completed: true,
            score: 4,
            timestamp: new Date().toISOString()
        });
        console.log('✅ Progress saved successfully');
        console.log('   Response:', progressResponse.data, '\n');
        
        // Test 3: Get progress
        console.log('3. Testing progress retrieval...');
        const getProgressResponse = await axios.get(`${BASE_URL}/api/ialab/progress/test-user-123`);
        console.log('✅ Progress retrieved successfully');
        console.log('   Response:', getProgressResponse.data, '\n');
        
        // Test 4: Get modules
        console.log('4. Testing modules endpoint...');
        const modulesResponse = await axios.get(`${BASE_URL}/api/ialab/modules`);
        console.log('✅ Modules retrieved successfully');
        console.log('   Number of modules:', modulesResponse.data.length);
        console.log('   First module:', modulesResponse.data[0].title, '\n');
        
        console.log('🎉 All IALab API tests passed!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testIALabAPI();