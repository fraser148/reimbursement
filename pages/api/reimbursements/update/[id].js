import { db } from "../../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
        const { id } = req.query;
        let bodyObject = JSON.parse(req.body);
        const reimRef = doc(db, "reimbursements", id);
        let okay = await updateDoc(reimRef, 
          bodyObject
        );
        res.json(okay);
        break;
    case "GET":
        break;
  }
}