module.exports = class User {   

  constructor(id, name, email, password, position, active) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password= password; 
      this.position = position;
      this.active = active;
  }
}