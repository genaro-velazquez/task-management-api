const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:NewSecurePass789@db.zupcwetebelhhcflbwoe.supabase.co:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    console.log('🔄 Conectando directo...');
    await client.connect();
    console.log('✅ ¡Conexión exitosa!');
    
    const res = await client.query('SELECT NOW()');
    console.log('📅 Servidor:', res.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
