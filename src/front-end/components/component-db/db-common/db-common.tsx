import { modelConfig } from '../../../../_config/config-model';
import { Link } from 'react-router-dom';
export const printModelTitle = () => {
  return modelConfig.map((v: any, i: number) => {
    if (v.visible) return <th key={i}>{v.label}</th>;
  });
};
export const printModelData = (data: any) => {
  return data.map((model3d: any, i: number) => {
    return (
      <tr key={i}>
        {
          // TODO:: innen folytatni
        }
        <td>{i + 1}</td>
        <td>{model3d.modelUuid}</td>
        <td>{model3d.modelTitle}</td>
        <td>{model3d.modelDescription}</td>
      </tr>
    );
  });
};
