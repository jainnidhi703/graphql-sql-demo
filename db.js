import Sequelize from 'sequelize';
import _  from 'lodash';
import Faker from 'faker'

const Conn = new Sequelize('relay', 'root', 'root', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

const Post = Conn.define('post', {
    title: {
        type : Sequelize.STRING , 
        allowNull: false 
    },
    content: {
        type : Sequelize.STRING , 
        allowNull: false    
    }
});

const Person = Conn.define('person', {
    firstName: {
        type : Sequelize.STRING , 
        allowNull: false 
    },
    lastName: {
        type : Sequelize.STRING , 
        allowNull: false    
    },
    email: {
        type : Sequelize.STRING , 
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});


Person.hasMany(Post);
Post.belongsTo(Person);

Conn.sync({force: true}).then(()=> {
    _.times(10, ()=> {
        return Person.create({
            firstName: Faker.name.firstName(),
            lastName: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then( person => {
            person.createPost({
                title: `Sample title by ${person.firstName}`,
                content: 'This is a sample article'
            })
        })
    });
});


export default Conn;


