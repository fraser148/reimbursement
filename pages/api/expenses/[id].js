import { db } from "../../../firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
        let bodyObject = JSON.parse(req.body);
        let newPost = await db.collection("posts").insertOne(bodyObject);
        res.json(newPost.ops[0]);
        break;
    case "GET":
        const { id } = req.query
        const docRef = doc(db, "expenses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            res.json({ status: 200, data: docSnap.data() });
        } else {
            console.log("No such document!");
            res.json({ status: 404, data: 'Could not find expense' });
        }
        break;
  }
}