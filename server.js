const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const schema = buildSchema(`
    type Query {
        course(id: Int!) : Course
        courses(topic: String) : [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String) : Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const getCourse = args => {
    const result = coursesData.filter(course => course.id === args.id);
    return result.length ? result[0] : null;
}

const getCourses = args => coursesData.filter(course => course.topic === args.topic);

const updateCourseTopic = args => {
    let updatedCourse = null;
    coursesData.map(course => {
        if(course.id === args.id) {
            updatedCourse = {...course, topic: args.topic};
            return updatedCourse;
        }
        return course;
    });
    return updatedCourse;
}

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
};

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: root    
}))

app.listen(4000)
console.log('Listening on 4000')