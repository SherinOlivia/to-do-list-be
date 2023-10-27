import cors, { CorsOptions } from "cors";
import { Application } from "express";

const XOrigin = [
  "http://localhost:5173","https://w18sh-fe.roozone.site","https://week18sh.web.app"
];
const YOrigin = [
  "https://week18sh.firebaseapp.com"
];

const corsOptionsDelegate = (req: any, 
    callback: (err: Error | null, options?: CorsOptions) => void) => {
  const clientXOrigin = XOrigin.includes(req.header("Origin"));
  const clientYOrigin = YOrigin.includes(req.header("Origin"));
  const requestOrigin = req.header("Origin");
  console.log("Request Origin: ", requestOrigin);
  
  try {
    
    if (clientXOrigin) {
      callback(null, {
        origin: true,
        methods: "GET, POST, PUT, PATCH, DELETE",
        credentials: true,
      });
      
    } else if (clientYOrigin) {
      callback(null, {
        origin: true,
        methods: "GET, POST",
        credentials: true,
      });
    } else {
      callback(new Error("CORS Unauthorized Access..!"))
    }
  } catch (error) {
    console.error("Error..:", error)
  }
};

const corsMiddleware = (app: Application) => {
  app.use(cors(corsOptionsDelegate));
};

export default corsMiddleware;