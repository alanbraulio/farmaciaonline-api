module.exports = class User {   

  constructor(id, name, email, password, cargo, active) {
      this._id = id;
      this.name = name;
      this.email = email;
      this.password= password; 
      this.cargo = cargo;
      this.active = active;
  }
}