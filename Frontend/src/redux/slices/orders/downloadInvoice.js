import { useDispatch } from 'react-redux';
import { getPDF } from './ordersSlices';


export function DownloadInvoiceLink({ orderID, orderNum }) {
  const dispatch = useDispatch();

  async function downloadInvoice() {
    try {
      const data = await dispatch(getPDF(orderID));

      const url = URL.createObjectURL(data.payload);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${orderNum}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  }

  async function viewInvoice() {
    try {
      const data = await dispatch(getPDF(orderID));
      const url = URL.createObjectURL(data.payload);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <a href="#" onClick={downloadInvoice}>
        Download Invoice
      </a>
      <p> </p>
      <a href="#" onClick={viewInvoice}>
        View Invoice
      </a>
    </div>
  );
}