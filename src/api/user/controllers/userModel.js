module.exports = class User {   

  constructor(id, name, email, password, positionId, active) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password= password; 
      this.position_id = positionId;
      this.active = active;
  }
}