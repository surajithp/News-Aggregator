const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();


/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
  });
  
  /* Closing database connection after each test. */
  afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
  })
  
   describe("GET /user/register", () => {
    it("should register user", async () => {
      const res = await request(app).post("/user/register").send({
        firstName: "Surajith",
        lastName: "Reddy",
        phone: "8019275501",
        email: "surajithp@airtribe.com",
        password: 'password',
        preferences: "sports"
      });
      expect(res.statusCode).toBe(200);
    });

    it("should login user", async () => {
        const res = await request(app).post("/user/login").send({
          email: "surajithp@airtribe.com",
          password: 'password',
        });
        expect(res.statusCode).toBe(200);
      });
  });

