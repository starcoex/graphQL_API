import { ApolloServer, gql } from 'apollo-server';

let tweets = [
	{
		id: '1',
		text: 'first one!',
	},
	{
		id: '2',
		text: 'second one',
	},
];
let users = [
	{
		id: '1',
		firstName: 'nico',
		lastName: 'las',
	},
	{
		id: '2',
		firstName: 'Elon',
		lastName: 'Mask',
	},
];

const typeDefs = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		fullName: String!
	}
	type Tweet {
		text: String!
		id: ID!
		author: User
	}
	type Query {
		allUsers: [User!]!
		allTweets: [Tweet!]!
		tweet(id: ID!): Tweet
	}
	type Mutation {
		postTweet(text: String!, userId: ID!): Tweet!
		deleteTweet(id: ID!): Boolean!
	}
`;

const resolvers = {
	Query: {
		allTweets() {
			return tweets;
		},
		tweet(root, args) {
			console.log("I'm called");
			// console.log(id);
			return tweets.find((tweet) => tweet.id === args.id);
		},
		allUsers() {
			console.log('allUsers Called');
			return users;
		},
	},

	Mutation: {
		postTweet(root, { text, userId }) {
			console.log(root);
			const newTweet = {
				id: tweets.length + 1,
				text: text,
			};
			tweets.push(newTweet);
			return newTweet;
		},
		deleteTweet(root, { id }) {
			const tweet = tweets.find((tweet) => tweet.id === id);
			if (!tweet) return false;
			tweets = tweets.filter((tweet) => tweet.id !== id);
			return true;
		},
	},
	User: {
		fullName({ firstName, lastName }) {
			console.log('fullname called');
			// console.log(root);
			return `${lastName} ${firstName}`;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Running on ${url}`);
});
