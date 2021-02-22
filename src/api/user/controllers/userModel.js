module.exports = class User {   

  constructor(id, name, email, password, crm, especialidade, crf, cep, cpf, endereco, dataNascimento, telefone, celular, position, active) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password= password; 
      this.crm = crm;
      this.especialidade = especialidade;
      this.crf = crf;
      this.cep = cep;
      this.cpf = cpf;
      this.endereco = endereco;
      this.dataNascimento = dataNascimento;
      this.telefone = telefone;
      this.celular = celular;
      this.position = position;
      this.active = active;
  }
}