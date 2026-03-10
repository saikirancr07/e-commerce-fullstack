import {useNavigate,useParams,useLocation} from "react-router-dom"

const withRouter = (WrappedComponent) => props => {
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()

    return <WrappedComponent {...props} navigate={navigate} params={params} location={location}/>
}

export default withRouter



// import { useNavigate, useLocation, useParams } from "react-router-dom";

// const withRouter = (WrappedComponent) => {
//   return (props) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const params = useParams();

//     return (
//       <WrappedComponent
//         {...props}
//         navigate={navigate}
//         location={location}
//         params={params}
//       />
//     );
//   };
// };

// export default withRouter;