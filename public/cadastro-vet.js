const vetForm = document.getElementById("cadastro-vet");

vetForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const vetData ={
        nome: document.getElementById("nome").value.trim(),
        cfmv: parseInt(document.getElementById("cfmv").value),
        especialidade: document.getElementById("especialidade").value.trim()
    }

    if(!vetData.nome || !vetData.cfmv || !vetData.especialidade){
         alert("Preencha todos os campos")
        return
    }

    try {
        const response = await fetch('http://localhost:3000/api/vets', {
            method: 'POST',
            headers: { 'content-type':'application/json'},
            body: JSON.stringify(vetData)
        });

        const data = await response.json();

        if(response.ok){
            alert(data.message);
            window.location.href = 'cadastro-pet.html';
        }else{
            alert(data.message);
        }
    }  catch (error){
        console.error('Erro na requisição', error);
        alert('Erro ao conectar com o servidor.')
    }
}); 