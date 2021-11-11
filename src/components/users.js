import React,{useState} from 'react'
import { getAuth } from '@firebase/auth'
import { useFirestore,useFirestoreCollectionData} from 'reactfire'
import { query,collection,writeBatch,doc,where } from '@firebase/firestore'
import { useTable,useRowSelect} from 'react-table'
import styled from 'styled-components'
import ModalComponent from './modal'
import { Loading } from '../pages/verification/[reference]'
import { deleteUsers } from '../helperfunctions/cloudfunctions'
import { Menu,MenuItem } from './navbar'
import { Button } from './addressform'
import { Field } from 'formik'
import { Formik,Form } from 'formik'
import { InputWrapper } from './addressform'
import { assignRole } from '../helperfunctions/cloudfunctions'

const Table = styled.table`
    tr:nth-child(even) {background: #fbf2ed}
    tr:nth-child(odd) {background: #e5cfc1}
    font-family: 'Montserrat', sans-serif;
    
    .container {
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Hide the browser's default checkbox */
      .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }
      
      /* Create a custom checkbox */
      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
      }
      
      /* On mouse-over, add a grey background color */
      .container:hover input ~ .checkmark {
        background-color: #ccc;
      }
      
      /* When the checkbox is checked, add a blue background */
      .container input:checked ~ .checkmark {
        background-color: #2196F3;
      }
      
      /* Create the checkmark/indicator (hidden when not checked) */
      .checkmark:after {
        content: "";
        position: absolute;
        display: none;
      }
      
      /* Show the checkmark when checked */
      .container input:checked ~ .checkmark:after {
        display: block;
      }
      
      /* Style the checkmark/indicator */
      .container .checkmark:after {
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
`

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <label class="container">
            <input type="checkbox" ref={resolvedRef} {...rest} />
            <span class="checkmark"></span>
        </label>
      )
    }
  )

function ReactTable({users}) {
    const data =React.useMemo(()=> users)
     
    const columns = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'displayName', // accessor is the "key" in the data
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
        {
            Header: 'Role',
            accessor: 'role',
          },
      ],
      []
    )
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      selectedFlatRows,
      state: { selectedRowIds }, 
    } = useTable({ columns, data },useRowSelect,
        hooks => {
          hooks.visibleColumns.push(columns => [
            // Let's make a column for selection
            {
              id: 'selection',
              // The header can use the table's getToggleAllRowsSelectedProps method
              // to render a checkbox
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <div>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
              ),
              // The cell can use the individual row's getToggleRowSelectedProps method
              // to the render a checkbox
              Cell: ({ row }) => (
                <div>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...columns,
          ])
        })
     console.log(selectedFlatRows)
    return (
        <div>
        <AdminOptions selectedRows={selectedFlatRows}/>
      <Table {...getTableProps()} cellSpacing='0' style={{}}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    //borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                    
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
                
              <tr {...row.getRowProps()}>
                {row.cells.map((cell,index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        //border: 'solid 1px gray',
                      }}
                    >   
                        {cell.render('Cell')}      
                    </td> 
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
      </div>
    )
  }
function AdminOptions({selectedRows}){
  const fs = useFirestore()
  const batch = writeBatch(fs)
  const [deleteState, setDeleteState] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAssignRoleDialog, setShowAssignRoleDialog] = useState(false)
  /*const deleteUsers = ()=>{
      setDeleteState('deleting')
      selectedRows.forEach(element => {
          const deleteRef = doc(fs,'users',element.original.uid)
          batch.delete(deleteRef)
      });

      batch.commit()
      .then(()=> setDeleteState(''))
      .catch(e=>setDeleteState('error'))
  }
*/
  function DeleteDialog(){
    return(
      <ModalComponent showModal={showDeleteDialog}>
      <div>
        <div>Are you sure you want to delete user(s)</div>
        <button onClick={()=>{deleteUsers(selectedRows); setShowDeleteDialog(false)}} >YES</button>
        <button onClick={()=>setShowDeleteDialog(false)}>NO</button>
      </div>
      </ModalComponent>
    )
  }

  function Deleting(){
      
      return(
      <ModalComponent showModal={(deleteState=='deleting')||(deleteState=='error')}>
       {deleteState=='deleting'?
           <>
        <Loading/>
        <div>Deleting user(s)</div>
        </> :
        deleteState=="error"? <><div>something went wrong </div><button onClick={()=>setDeleteState('')}>close</button></>:
        <button onClick={()=>setDeleteState('')}>close</button>
       }
      </ModalComponent>
    )
  }
    return(
        <div>
        <Menu style={{justifyContent:'flex-start'}}>
            <MenuItem><Button secondary style={{width:'fit-content'}} onClick={()=>setShowAssignRoleDialog(true)} >Assign role</Button></MenuItem>
            <MenuItem><Button secondary style={{width:'fit-content'}}>Disable</Button></MenuItem>
            <MenuItem><Button secondary style={{width:'fit-content'}} onClick={()=>setShowDeleteDialog(true)}>Delete</Button></MenuItem>
        </Menu>
            <AssignRole showAssignRoleDialog={showAssignRoleDialog} setShowAssignRoleDialog={setShowAssignRoleDialog} selectedRows={selectedRows} />
            <DeleteDialog/>
            <Deleting/>
        </div>
    )
}
  export default function Users() {
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');
    const usersQuery = query(usersCollection,where('deleted','==',false))
    const { status, data:users } = useFirestoreCollectionData(usersQuery);
    if(users)
    return (
      <ReactTable users={users} />
    )
    else
      return <div>No user found</div>
   }

function AssignRole({showAssignRoleDialog,setShowAssignRoleDialog,selectedRows}){
    return(
    <ModalComponent showModal={showAssignRoleDialog}>
        <Formik
        initialValues={{role:''}}
        
        onSubmit={(values, {setSubmitting}) => {
        setTimeout(() => {
            assignRole(values,selectedRows)
        }, 400);
        setSubmitting(false)
        setShowAssignRoleDialog(false)
        }}>
        {({isSubmitting,setFieldValue,handleChange,handleSubmit,values,errors }) => (
           
        <Form style={{display:'flex',flexWrap:'wrap',width:'100%',overflow:'hidden',maxWidth:'500px'}}>
        <InputWrapper style={{maxWidth:'80%'}}>
            <Field as='select' name='role'>
                <option value="">Select Role</option>
                <option value="dispatch">Dispatch</option>
                <option value="admin 1">Admin 1</option>
                <option value="admin 2">Admin 2</option>
            </Field>
        </InputWrapper>
        <button onClick={()=>setShowAssignRoleDialog(false)}>Cancel</button>
        <button type='submit'>
            Submit
        </button>
        </Form>
        )}
        </Formik>
    </ModalComponent>
    )
}