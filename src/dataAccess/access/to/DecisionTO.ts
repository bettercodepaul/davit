import {DataAndInstanceId} from '../../../components/common/fragments/dropdowns/InstanceDropDown';
import {GoTo, GoToTypes} from '../types/GoToType';
import {AbstractTO} from './AbstractTO';

export class DecisionTO extends AbstractTO {
  constructor(
    public name: string = '',
    public sequenceFk: number = -1,
    public actorFk: number = -1,
    public dataAndInstaceId: DataAndInstanceId[] = [],
    public ifGoTo: GoTo = {type: GoToTypes.FIN},
    public elseGoTo: GoTo = {type: GoToTypes.ERROR},
    public root: boolean = false,
  ) {
    super();
  }
}
