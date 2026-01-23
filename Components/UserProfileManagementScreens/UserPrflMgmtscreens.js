import { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
  () => import('./UserProfileManagementTable'),
  { ssr: false }
)

const UserPrflMgmtscreens = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [dataList, setDataList] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState('')
    const[loader,setLoader]=useState(false)
    const [isRoleAssigned, setIsRoleAssigned] = useState(false)
    const [deleteConfirmMessage, setDeleteConfirmMessage] = useState("Are You Sure you want to Delete ?")
    const allowedpermissions=hasCookie("allowedpermissions")? JSON.parse(getCookie("allowedpermissions")) :null

    function disableConfirm(value) {
        setcurrObj(value)
        setdisableShowConfirm(true)
    }

    // Check if role is assigned to users before showing delete confirmation
    async function deleteConfirm(value) {
        setcurrObj(value)
        
        // Check if role is assigned to any users
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 59
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/users/rolewise?role_id=${value}`, header);
                console.log('Role check API response:', response);
                
                if (response?.status === 200 || response?.status === 201) {
                    const usersWithRole = response.data?.data || [];
                    console.log('Users with role:', usersWithRole.length, usersWithRole);
                    
                    // Check if there are users with this role
                    if (usersWithRole && Array.isArray(usersWithRole) && usersWithRole.length > 0) {
                        setIsRoleAssigned(true);
                        setDeleteConfirmMessage("This role is already assign to a user Are You Sure you want to Delete ?");
                    } else {
                        setIsRoleAssigned(false);
                        setDeleteConfirmMessage(" Role is already assigned. Are You Sure you want to Delete ?");
                    }
                } else {
                    // If response status is not 200/201, show warning message as precaution
                    setIsRoleAssigned(true);
                    setDeleteConfirmMessage("This role is already assign to a user Are You Sure you want to Delete ?");
                }
                setdeleteshowConfirm(true);
            } catch (error) {
                console.error('Error checking role assignment:', error);
                // If API fails, show warning message as precaution (safer to warn)
                setIsRoleAssigned(true);
                setDeleteConfirmMessage("This role is already assign to a user Are You Sure you want to Delete ?");
                setdeleteshowConfirm(true);
            }
        } else {
            // If no token, show warning message as precaution
            setIsRoleAssigned(true);
            setDeleteConfirmMessage("This role is already assign to a user Are You Sure you want to Delete ?");
            setdeleteshowConfirm(true);
        }
    }

    const getDataList = async () => {
        setLoader(true)
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:55
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/role`, header);
                if(response?.status === 200 || response?.status === 201){
                    setLoader(false)
                    setDataList(response.data.data);
                }
            } catch (error) {
                setLoader(false)
                if (error?.response?.data?.message) {
                  toast.error(error.response.data.message);
                }
                else {
                  toast.error('Something went wrong!')
                }
              }
        }
    }

    async function disableHandler() {
        setdisableShowConfirm(false)
         let reqInfo = { loss_id: currObj, status: false }
    
         if (hasCookie('token')) {
             let token = (getCookie('token'));
             let db_name = (getCookie('db_name'));
    
             let header = {
                 headers: {
                     Accept: "application/json",
                     Authorization: "Bearer ".concat(token),
                     db: db_name
                 }
             }
    
             try {
                 const response = await axios.put(Baseurl + `/db/role`, reqInfo, header);
                 if (response.status === 204 || response.status === 200) {
                     toast.success(response.data.message)
                     setdisableShowConfirm(false)
                     setcurrObj('')
                     getDataList();
                 }
             } catch (error) {
                if (error?.response?.data?.message) {
                  toast.error(error.response.data.message);
                }
                else {
                  toast.error('Something went wrong!')
                }
              }
         }
    }

    async function deleteHandler() {
        setdeleteshowConfirm(false)

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));
    
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:59
                }
            }
    
            try {
                const response = await axios.delete(Baseurl + `/db/role?role_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj('')
                    setIsRoleAssigned(false)
                    setDeleteConfirmMessage("Are You Sure you want to Delete ?")
                    getDataList();
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                  toast.error(error.response.data.message);
                }
                else {
                  toast.error('Something went wrong!')
                }
              }
        }

    }

    useEffect(() => {
        getDataList();
    }, [])

    return (
        <>
            <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={disableHandler}
                title={"Are You Sure you want to Disable ?"} />

            <ConfirmBox
                showConfirm={deleteshowConfirm}
                setshowConfirm={(val) => {
                    setdeleteshowConfirm(val);
                    if (!val) {
                        setIsRoleAssigned(false);
                        setDeleteConfirmMessage("Are You Sure you want to Delete ?");
                    }
                }}
                actionType={deleteHandler}
                title={deleteConfirmMessage}
                cancelLabel="No"
                confirmLabel="Yes" />

             <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">USER PROFILE MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/setting'>Home </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">User Profile Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <Link href='/AddProfileManage'>
                                <button className="btn btn-primary Add_btn">
                                    <PlusIcon />
                                    ADD PROFILE
                                </button>
                            </Link>
                        </div>
                        <DynamicTable
                            title='Users Profile List'
                            dataList={dataList}
                            disableConfirm={disableConfirm}
                            loader={loader}
                            deleteConfirm={deleteConfirm} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPrflMgmtscreens