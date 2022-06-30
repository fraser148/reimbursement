import { db } from "../../../firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const querySnapshot = await getDocs(collection(db, "reimbursements"));
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let newPost = await db.collection("posts").insertOne(bodyObject);
      res.json(newPost.ops[0]);
      break;
    case "GET":
      let docs = [];
      querySnapshot.forEach((doc) => {
        let myData = doc.data();
        myData.id = doc.id;
        docs.push(myData);
      });
      res.json({ status: 200, data: docs });
      break;
  }
}