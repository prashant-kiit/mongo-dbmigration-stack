const axios = require("axios");

describe("DocumentDB Migration API Tests", () => {
  const BASE_URL = "http://localhost:9001/v1/documentdbmigration";

  test("should fetch all surveys", async () => {
    const res = await axios.get(`${BASE_URL}/test1`);
    const data = res.data;
    console.log("Test 1 data:", data);
    expect(data.oldSurveyCount).toBe(data.newSurveyCount);
  });

  test("should fetch responders by responderObjectId", async () => {
    const responderObjectId = "5e3c808ad16833762c17c5bc";
    const res = await axios.get(`${BASE_URL}/test2?responderObjectId=${responderObjectId}`);
    const data = res.data;
    console.log("Test 2 data:", data);
    expect(data.oldResponderCount).toBe(data.newResponderCount);
  });

  test("should fetch survey opt-out information", async () => {
    const res = await axios.get(`${BASE_URL}/test3`);
    const data = res.data;
    console.log("Test 3 data:", data);
    expect(data.oldSurveyOptOutCount).toBe(data.newSurveyOptOutCount);
  });

  //   test("should find a survey by surveyId", async () => {
  //     const surveyId = 24717;
  //     const res = await axios.get(`${BASE_URL}/test4`, {
  //       params: { surveyId }
  //     });
  //     expect(res.status).toBe(200);
  //   });

  //   test("should verify responder existence in collection", async () => {
  //     const res = await axios.get(`${BASE_URL}/test5`);
  //     expect(res.status).toBe(200);
  //   });

  //   test("should update a survey record using surveyId and sampling flag", async () => {
  //     const res = await axios.get(`${BASE_URL}/test6`, {
  //       params: {
  //         surveyIdToUpdate: 24717,
  //         isSampling: true
  //       }
  //     });
  //     expect(res.status).toBe(200);
  //   });

  //   test("should update multiple responders for a given survey", async () => {
  //     const surveyId = 15011;
  //     const status = "invited";

  //     const responders = [
  //       {
  //         _id: { $oid: "5e3c808ad16833762c17c5bc" },
  //         crowdId: 14676,
  //         firstName: "Dental",
  //         lastName: "Hygenist",
  //         email: "incrowdqa+dentalHygienist8@gmail.com",
  //         attributes: { state: "MA", gender: "M" },
  //         surveys: {
  //           "15011": {
  //             invites: 3,
  //             lastInvite: "2020-02-07T16:00:01.453Z",
  //             status: "invited"
  //           }
  //         }
  //       },
  //       {
  //         _id: { $oid: "5e3c808ad16833762c17c5bd" },
  //         crowdId: 14676,
  //         firstName: "Dental",
  //         lastName: "Hygenist",
  //         email: "incrowdqa+dentalHygienist9@gmail.com",
  //         attributes: { state: "MA", gender: "M" },
  //         surveys: {
  //           "15011": {
  //             invites: 3,
  //             lastInvite: "2020-02-07T16:00:01.453Z",
  //             status: "invited"
  //           }
  //         }
  //       }
  //     ];

  //     const res = await axios.put(
  //       `http://qual-qa.my.konovo.com/v1/documentdbmigration/test7`,
  //       responders,
  //       {
  //         params: { surveyId, status },
  //         headers: { "Content-Type": "application/json" }
  //       }
  //     );

  //     expect(res.status).toBe(200);
  //   });

  //   test("should insert multiple responders into the collection", async () => {
  //     const payload = [
  //       {
  //         crowdId: 50000,
  //         firstName: "Dental",
  //         lastName: "Hygenist",
  //         email: "incrowdqa+dentalHygienist8@gmail.com",
  //         attributes: { state: "MA", gender: "M" },
  //         surveys: {
  //           "15011": {
  //             invites: 3,
  //             lastInvite: "2020-02-07T16:00:01.453Z",
  //             status: "invited"
  //           }
  //         },
  //         optedOutOn: null
  //       },
  //       {
  //         crowdId: 50001,
  //         firstName: "Dental",
  //         lastName: "Hygenist",
  //         email: "incrowdqa+dentalHygienist9@gmail.com",
  //         attributes: { state: "MA", gender: "M" },
  //         surveys: {
  //           "15011": {
  //             invites: 3,
  //             lastInvite: "2020-02-07T16:00:01.453Z",
  //             status: "invited"
  //           }
  //         },
  //         optedOutOn: null
  //       }
  //     ];

  //     const res = await axios.post(
  //       `http://qual-qa.my.konovo.com/v1/documentdbmigration/test8`,
  //       payload,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     expect(res.status).toBe(200);
  //   });

  //   test("should replace survey opt-out entry by surveyId and email", async () => {
  //     const surveyId = 24721;
  //     const email = "prashant.singh@konovo.com";

  //     const res = await axios.get(`${BASE_URL}/test9`, {
  //       params: { surveyId, email }
  //     });

  //     expect(res.status).toBe(200);
  //   });
});
