import {useDispatch} from 'react-redux';
import {DataSetupTO} from '../../../dataAccess/access/to/DataSetupTO';
import {EditActions} from '../../../slices/EditSlice';
import {SequenceModelActions} from '../../../slices/SequenceModelSlice';
import {DavitTableRowData} from '../../common/fragments/DavitTable';

export const useGetDataSetupTableData = (dataSetups: DataSetupTO[]) => {
  const dispatch = useDispatch();
  let bodyData: DavitTableRowData[] = [];
  bodyData = dataSetups.map((dataSetup, index) =>{
    const onClickEdit=() =>dispatch(EditActions.setMode.editDataSetup(dataSetup.id));
    const onClickSelect=() => {
      dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id));
      dispatch(EditActions.setMode.view());
    };
    return createDataSetupColumn(dataSetup, onClickEdit, onClickSelect);
  },
  );
  return {
    header,
    bodyData,
  };
};

const header = ['NAME', 'ACTIONS'];

const createDataSetupColumn = (
    dataSetup: DataSetupTO,
    editCallback: ()=> void,
    selectCallback: ()=> void,
): DavitTableRowData => {
  const name: string = dataSetup.name;
  const trClass = 'carv2Tr';
  const editAction = {icon: 'wrench', callback: editCallback};
  const selectAction = {icon: 'wrench', callback: selectCallback};

  return {
    trClass,
    data: [name],
    actions: [editAction, selectAction],
  };
  // return (
  //   <tr key={index} className={trClass}>
  //     <td>{name}</td>
  //     <td>
  //       <Carv2TableButton
  //         icon="wrench"
  //         onClick={() =>
  //           dispatch(EditActions.setMode.editDataSetup(dataSetup.id))
  //         }
  //       />
  //       <Carv2TableButton
  //         icon="hand pointer"
  //         onClick={() => {
  //           dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id));
  //           dispatch(EditActions.setMode.view());
  //         }}
  //       />
  //     </td>
  //   </tr>
  // );
};
