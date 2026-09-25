const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const db = mysql.createPool({
host: 'localhost',
user: 'admin', 
password: '1234',
database: 'login',
port: 3306,
});

app.post('/api/login', async (req, res) => {
 const { email, senha } = req.body;

try {
const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

if (rows.length == 0) {
return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
}

const usuario = rows[0];

if (usuario.senha != senha) {
return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
} 

return res.status(200).json({
message: 'Login realizado com sucesso!',
usuario: {
    id: usuario.id,
    email: usuario.email
}
}); 

} catch (error) {
console.error('Erro no banco de dados:', error);
return res.status(500).json({ message: 'Erro interno no servidor.' });
}
});

app.post('/api/vets', async (req, res) => {
    const { nome, cfmv, especialidade } = req.body;

    if (!nome || !cfmv || !especialidade) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO veterinarios (nome, cfmv, especialidade)
            VALUES (?, ?, ?)
        `;

        await db.query(query, [nome, cfmv, especialidade]);

        return res.status(201).json({ message: 'Veterinário cadastrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao salvar veterinário:', error);
        return res.status(500).json({ message: 'Erro ao salvar no banco de dados.' });
    }
});



app.post('api/pets', async (req, res) => {
    const {tutor, nome_pet, raca, genero, peso, idade} = req.body;

    if (tutor || !nome_pet || !raca || !genero || !peso || !idade){
        return res.status(400).json({ message: 'Todos os campos são obrigatórios'});
    }

   try{
     const query= `
     INSERT INTO pets (tutor,nome_pet, raca, genero, peso, idade)
     VALEUS (?,?,?,?,?,?)
     `;
   
    await db.query(query, {tutor, nome_pet,raca, genero, peso, idade});
 
    return res.status(201).json(['Pet cadastrado com sucesso!']);
   } catch (error) {
    console.error('Erro ao salvar pet:', error);
    return res.status(500).json({ message: 'Erro ao salvar no banco de dados.'});
   }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
 
process.on('uncaughtException', (err) => {
console.error('O SERVIDOR CAIU PELO SEGUINTE ERRO:', err);
});