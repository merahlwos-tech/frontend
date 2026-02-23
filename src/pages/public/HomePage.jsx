import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

/* ══════════════════════════════════════════════════════
   BRANCHE FLORALE — image exacte encodée en base64
══════════════════════════════════════════════════════ */
function FloralBranch() {
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABCMAAADhCAYAAADyIH9kAAAX0klEQVR4nO3daZLbSJIGUKSsjj+HmGvM6bJ/1GSLoggSSyzuHu+ZlY1NdUnE4ojlQwD4+t//+b8NAAAAYJRfszcAAAAAWIswAgAAABhKGAEAAAAMJYwAAAAAhhJGAAAAAEMJIwAAAIChhBEAAADAUMIIAAAAYChhBAAAADCUMAIAAAAYShgBAAAADCWMAAAAAIYSRgAAAABDCSMAAACAoYQRAAAAwFDCCAAAAGAoYQQAAAAwlDACAAAAGEoYAQAAAAwljAAAAACGEkYAAAAAQwkjAAAAgKH+mb0BAADQ2feb/+1r2FYA8F/CCAAAKnoXQHz67wQUAJ0JIwAAqOJoAHHk7xFIAHQkjAAAILtWIcSrv1MoAdCBF1gCAMC+HkEHwPKEEQAA8J5AAqAxj2kAAJDR6IDAYxsADVkZAQBANjNXKlglAdCAlREAMNfRiY27sRCHVRIAN1kZAX/7fvgHoKcz7Yx2CeJxTQJcZGUEVbX8zvi2ufMBtHWnjfretEmsy+QfoAhhBBWMGJi8+g2TAeCslkGpNojVRA0iWl6Pj/voGgdKE0aQWdRBCcArrdssgQTU9q7NcO0D6QkjyCZSAOERDuCoXm2XQIJVROr/e6i+fwB/EUaQgQ4ayEwbBvdUvoau7tvznxNKAukII4go26DDnUlgz6h32miDIJ+W7YPVmkA6wgiiyBZAAERyJ5DYa39Naoig6vjAo1vA8oQRzFZ1kAEQsX07s03utEI7I9sD1y6QgjCCmSIO1AFamNG+9boj6tl0uMY4B+ANYQQz6JwB+tgLJDybTkZZxwtRttu1CoQmjKC3KB0ywKp6Ppu+bSY65PFYqz2uC2MegBOEEbSmIwZWN7sdnP37ENFzaPbz/7e6XiJfd4/bJjwEwhBG0ErkThhglBXbQisk6KHltaQ2AQISRsA9BjjAjxWDCOhh1LXkmgWY6NfsDaAEnTkA+gIA4DArI7jDwBMAAIDTrIwAgPuEs/9yHLhLDQEswsoIrjBQ+Jf3RQBAOz3GF/pqgKCEEZwhhAAAAOA2YQSvCB3ec5cFeKTNBAA4yTsjePS9GVQDAHMI+wEWYmUEke0NSmYGJgZKALSy15+t2te07t9XPY4AKQgj+BFpRcSnwcPXNmd7DWoAGOGnj9PvrOHVeY40LgPoQhhBFEcHXLM6ZwNCAFo40499b/qfqzIct3fbOOvGC8Awwghmyz5YAIAjTCzfW+34GFsAyxNGMMuVTtijGQBkc7fvsjqiHucTYBNG8K/Rk/zoj2T8MFgAKnhsy961qy2WhWs3ieBTHUZ/Efbs8Q/AEMIIRnZ4mTpgA2qgondtW6/29/HvXa1tjdKnkUPPelnt2gMSEEYwQqYQAqCS3hOQ57//U1v+/L9XnSC17tM8qlGX8Q+wLGHEuqJ0flG244fBHsA4q4QTjJP9EY0KvwlwiDBiTSM6YqshAGoZ8YjHz9+TeQKlbzuv+jHbq+fe+535OgIWIIxYjyDiNR02wN+0jedE69uIS60AyxNG1OcFlZ8ZbAMVnWnb9trmIysVerTr3pHwN8fks4iPaDhnADuEEazMAAEgrmyT74hhO2NF+XR5pusGWJgworZenV2Lu20z6aSBlr62mG1dS3srJKrv91GOw3yz+/bZvw+QjjCCM6Ik/lcZKAC9RAwkeqwsGL2P2VZH9OZ4xON8AFwkjKir9YAx4nOYRxkoANBL5P4vg1HHb/S4aJao2wXwF2EER2QLInTEAIwQrf8DgDR+zd4Amvvext5liDQQ+9oEEcA8mdufzNu+Eudp37vxSKSxCgD/z8oIPvGyMoC8jr5jQNt+juN136hPwvb4nTuhUM/aEVYBqQgjOCPa4EunC0QT8UWWr2TYRrgicm0LIgAeCCPYE71Ti759AFFEnpxl5HhyhnoB2CGMIBshBAAzzJ5UVun/Zh/H3mbsX5XaABYjjOCVV53a7MGDjhZgPdr+WmaPJVqIOEYCSEkYUUerjjDawC/a9gCwFhPN+yodw0r7AjCVT3vy7FUnO2vJoSACWJk2kB9ZayHaJ8ABCMTKiBpad/QzBw5ZB1wALWX5KkdP+gM45ugnfAFCEUbkVmmgqhMFAABYhDAip0ohxLYJIqCVx7bh682/o4+WbXO1dv6sKLW6+nm4w7Eb6+d4R7l2AD4SRuShUwd+HGkP7rz/RZARg0c1AICyhBE5VB+MvnvW8d2+mxyxmlFtwbsgw3XHKqr3vT05dvM8H3ttNhCWMCK2lTrzK/uqw2UVkdoC1904kc77K1dCZACAbduEEREZxF3nzi2VZGkLPMqxHucZ8jA2AsISRozz6XGDLBOPDPaOpY6YyCq0AQa9da12Titcj/DI5z+BcIQRfR0dzBj0jHHlOOu46anqtW/QW4fzCHUIjIFQhBF9VJ1grMjz8bSmfSCLs+1dldqOth/6HQBKEkZcE22gwjjCCe5Yqe1wBy63M+etdV2rmdxWauey0j4DIQgjdJrco0PnKG0NUUVqvyJty1U/++CaJzqP1AFTrRhGGBzQw6u60sGzbdoc4mrRRqnvP7Vs9/Uh/3o+Dhlr7nEfom2/QAKYZqUwIlrjT30e6UC7s5bVvoxU8fGMO/sUYfuJ5VVNvPp3K7UbAP9VPYzQuBPJYz0atNam7SG6O22Q+v6bNr2Pvcl8hho8UxNH/tsM+wxwStUwQoNNdFZN1KX9IbpoQUSU9s+1m8eVQGL0uzxaP/7gXSRAOVXCCA0z2e3VcJRBOp9ph17zPHINvepbbfDOu/bjaCDx/OdHrqzI8pJr7TQwRfYwwuCf6gwQYtMGUd0qNd5rxcfVv1e7f8yr1QLVj12Wx1QAPsoWRmh8WVGWOyvE5qVpY1SaKPTcj0jt2d39jLQvqzp7DipdpwBpRQ8jdBTwm1USsURvn47UigE5r/SuiUjtWM99dW210avvy/i4hpoCSokURmhg4bMrz8fSVvS2yvknMvVZW6/2sdcKQYEswEQzwgiNfn8tO2vnKx8rKPqIci24vuOL/Nb7T/WzyqMZtDei3nv0byOvV/0zwINRYUTEAVkFIzq0x99wHvPwnoncqpy3KvtRyavJ0Ii2PWIt6NNyyr5K4kogoVaBknqGERrOv7VI32cO6LwALx+hRBvVJmuu27U5/+1oW+fp0b+NDCR+fg9gWb3CCAOd986uNojcWb3bNnUQx6tzEbmuoqhWwyP3R315Hv1H1VpYvf+Lso+tP+s5+rGNx998/vcApbUKIzSa773rHKsO0rYt5iMelkb+5s5MDCOO/6g6VkusYuVar9wvPprxtQ2ApdwNIzSeHBX5hW7vrPBoyt7+rDzY3rY657nKfmS1+uqIqO1I5E96Rj1m2xa/lluH7Ktcv5FrDijsbBixQoPcmgb+TxU69gr7cETrpa+ZVFlJUO1dF+SiNmrJ1O9Z+XecYwRMM+PTnqtZeUK3Z+YqiVaf1Vrt+c5V6rhKCLFtggjmURfXRD1umfs3n9J8z7EBpjoSRmTuhKJZZUJ31KwVBj0eS1gpnKh6x8nk/ZxK+0Ibq9RE9RdXVtiHR8ZeAEFZGTFP1QndWZFectlywLLKuyay12+llRA/hCrQj9rPTTDx2+r7DwSwF0ZUmzRFVmFC10rEYKL198sf/+4KDOz2VT0eVfeLazLWQ8Q2OMpxjHhsZqp4PKLUGoCVEYQV5SWRPUOJV79DfrMGemoopqrnZcUJTeV9rlqn76y2QnWV/QQSEUbEYHXEa5FWEvQetFR458TzNkeu6V7Hd/Q+j66TyOeUcVasgyP7fPV6FGDOtTcGq3R8VrxmgQSew4hKDW82qyX0Z0R7fGPEOYoUxFzV40WhkVV7L8Szquetl8zX7h41sC/T+c60raM8jsEcH4BBrIwgmwiT9JErWSIFMa1UDN5a70u0c13pXLG2aNfWKKvu91lVjpM2G0hBGAHXzHi0plow4fGk3yKeT+fmuojn8w61kFu1esQ1CRTxGEZE7Kyqf8v7FRO0YyIspZx5rqoEE1W+xnGnFqKdv8znYbZo57IF9dDXiquqom1jJq5HoJTMKyOqTMa4brVHNvZEOA4tZH984+gLPCOfp6zHfrbI5/QO9fDbXvt059xXPr7v9i3CzYRsKtcKsLAZYYQG9bMqd4tHmT0ZjzKJnn0cWuld/6OOT5bzMLtuM8tyjs9SE+9FOu+RtmXbjtdOlf6qhVfHwjUILCHzyohHOjUiiLBKYttq3XVqHfRUOS53RajT7KrWktp4b/Z5n/37z+7Wy2rjt08rRgCW0jOMmNGoVpqE/ZCUHxfh0Z1oqyQeZb42jj4CcfTPr2h2TRLXSrWReZyQdbuPyHxejlrpOgM45DGMaJVOz25sV+jQ+Gz23ZYoqyQeVQoosm43eVWruWjtE69Fq7uedTO73wZgsFcrI66+nCnSwGZGIDHiyx8RJ7jRzVwtEWWVxDsRVpMAv/V+8Wnk9miUKDcterwUs7VZq1y3LdZxuMr1BvDG2cc0NKrXtOxYBRLXzRrgZAgltq3WAJB/Ra+5DEZeD2efJ997jM/jfZ9FCSSiilA3+iSA4o6EERE6pCtGDTTOHJ9W2ySQoCcDwBq0EblcOV97f8a5zyVSW6t22nAcAQ6o8jWNFWW52x6RyfYx7hzmoz24L8pKCBgpci1me5ww8rEECKV6GDFi0mmVQl6jJ9sZayXbIHBV2eoqIvUN8UXuk7TDACdVDyN+9A4lZk4yrZBglMiDwFW57u+ZUcfOGVFkr8UoqxyzH0eAaVYJIyLp1XlmvOseQZTBTDZHas0x7ce1Dvet+ihatfZj1NdIqh03gOmEEe1ECAMibAPQlmsaaGWF9qT1TYYVjhnAFKuFEZHuglshEYtHENqLdL1F9uo4uYb784gGK7RNK9fc3r4/t7Wv6mDl4wYwzGphRG9XggATtnhWXbrbi+P5J59jXI9zy0jq7b3n4+N4AUwijGjv6gslW07YvNQyrlVXrqy68mTFcx3Z6Npz/hlNzQGQxq/ZGzDJ19a/w44w4YqwDVn1rI/Vz8vXNuYahJnUN6NoUwFIycqIvs6uUOjxyMaqd+Kja3FeKrxjoPJjSlnPSSUV64o2qtSGdgaAtIQRY5ydeFaeoPFb69DpWaZBqpqntVm1lOm6Ix/1BUAZq4cRI1+sd/Xlli22zzsk1vRcOxnOf6VQwqqk8SrUDbyiLQGgnFXfGfFoZAf/vZ0fLBuAzGFSM9fXi38yunLNc02E45y1TlfkXAHAZKuvjPgx+tODV94lEWGgvYLKxzn7Cpnn7c50rjKuUskiQh04n/lEqJsj1BYAZQkjfpsx4T/zAkKBRH+rHN8KL77ctnU/F0ocma+flWVoL9QWAOUJI/40c8J/ZIIokOhn1eNa5b0G2YKJKoHQTLPPs/OW0+y6eUUtAbAkYcTfTPjX4lznf3zjWbaXYHqE429Rz51zk5eaAoBghBExvZoctvqqhoEPe6rdrc8aLO59prXa+XmW8VwRX7S6qnjtAsAlwojXotxZnf371Tm++6oEV1kDiWfP+1BpNUWG85P5+K4oQ00BwPJ82hPYU2VAn/nToEdlPFc+e0oPUWtqhXYIAE6xMuK9KndVH1V7P8BV1c5rL1VWSKzgak2PPr+Zrj21n0fUulJDALBDGMFqog5YIxNI1Nb7kQ/XHL1Eri1tJgB8IIz4LMr7I1ozwWQ1Va/l1vZeoHn2z2SmbYytWr0BwJKEEcdVfGQD4IhV2j4hRGwZ6lANAcBBwohz9gYZGQZIr6y0OiLrOYqi0rtGrJDgWYW6zqrKdaiGAOAkYQQrBRLwSCjBtmn/Rqt2vakfALhIGNHGq8FItQFXZs5FOxXDK6HEmqrVcXTVri/1AwA3CSMgn9mT54qBxLbNP66MU7F+o6pyPakZAGhMGNGPiQ2tPQ+GrciB40wm+6ra9qgbAOhEGMG21b3TXcnR8/P43/WcHFSuGV/OqadqrY62ynWhXgBgAGFEf1ZIcNfVgXHv2qscSFCHGv3TY3vw7tis2GepFQAYSBgxjlCCWXre6RdIQCxnrvVV+yNtFgAEIIwYL2IoYWBWX8S6A9pwXb+njwOAgIQR85gcMoP3IRzT8jg55nP9HPsKE1J1dF6F8w4AJQkj5psdShioXTdqktn6UYjZNbeSr6f/u22O+yyvjnu09k9t3BftnAIAO4QRcZgg9tH6eM4a6PZ4N0OrMMV7I15zTOLr1T5oxwEAPhBGxPNqAtNrYFt9sjQiiLAEn7PUTF3O61zV+zQAKEUYkcPIgIK/RRngHv0kH23cDQ1Gvqtg7ze0E6zkbL1rRwFgImFEXme/D2/QVYtznEfvx1je/d2fgkyPFQAAMIUwoiaT0jayHcczd+JNPte197jRI/XBCoS6ADDRr9kbAEFVHpCaaB7Xqg6yHfOvh39gJd9bvusVAFKyMoKq7gwmTcDOcbzmGv0YiIkaK9irc+0dADQijIA/VRho7j2uYRI51+N5yfyuBi/UZWUe7QCARoQRUJcJYhs+xfmZgIKV+dIRAFwgjKCikZMgEy4i6P2oxhVW5rAiwQQAHCSMAO4w2L6n5aqLiIHEo7OfI4bsznzhCACWI4yA3wwY2ZMlNIgeSJDLXi0Jj84RSgDAC8IIuG7lAblBdTveSeGdE7OdvZ4f/3vn6TihBAA8EEYAjPe8giHLyouRvHPivhF1kPnLMLNUuUYB4BZhBHDWqoPoTCsYKk52Xh1/jxHsG33+hRLneNElAMsTRlBNxoGwJc/0UHFJ+NF9ObPPryaFR0OPvb+nl0rnkt8EEwAsSRgB19ydeBhw5pRpdQTHvLoWr1yfrum4Mq2guRKEAUBKwgg4L+IAdgSD4rZevTfi59/3/B3oKdLjGp/qPsOLU12/AJQljKCSO4PIkYO9jAPLjNvcS6+XTUabBEFWd9qrT392xnVa8ZErABBGALsMfMdw55OKZoVsva8l4SEANPJr9gYAf/jaYkxMI2xDZK2Pj4kNVY1uS0ZdSzPa6u9NWwFAIVZGAD8EEHVZfcFMo1cTjKz3598RFgDAQcIIOKfFQDPaxDDStgB1jQwl3v1GzzZvxD764gYAJQgjIKYRA1oD2Htaf+Yz0+cH4Y7Zn8it9kLIx2NZZZ8AWIB3RgDEZnJBRRHq+nvr9x6GWe//EV4CkIYwAuC6kc+lR5i8QUsr1PSsQMLLLgEIz2MaEFuvxzVWmARkE+1dIjDC7Ec2frzahlbXo8+BAsALwgiAe6JMpj4RdhBV1Gvo7DZ9ur5m7Ge192MAUIjHNACA2SpMlo88GlFhPwGgCWEEHBfxzh0xtJpgqDFWVmWivhdKeI8DADzwmAZALJZVs7JK71eosA8A0I2VEfAvg0ai6VGT6pwsfEEGAIoTRlBJ5YFr5X1j3/fmM32sTdsHAEUJI2AOE8t6TJqgD9cWABQkjIA8DMjjy3COrLIgI49tAEAxwgg4xuQNAACgEWEE5OLOYHxZzpGAjYyyXF8AwAfCCPht9PJ1k0FmU4Nk5JGNcxwrAEISRgAA1CSIACAsYQTVtBh4Pa+Q6Hn32J1pgGuskHjPsQEgtH9mbwAENiooePwdg8cafs6jsAn6+9pcawCQjjACYhkVTHx3/vvJQy1QwZUarhpguJ4BSEEYAXH9DJQNLAHae2xbswcT+gkA0hFGUFG1JbuPd64r7RdAFK8m85HbW+EDAOkJIyCHyINi9gmRIK+jE/4R17fwAYByhBEAANftBQUtQgohBABlCSMA+rNCAvghYACATRgBMFLU95n4oga055oCgDd+zd4A6MQgkKi+NvUJAMDihBFUZsJHZOoTAIBlCSOorveE72vLeac72/YCAACFCCPgmowBBPGoIQAAliSMYAWjJnwCCq5QMwAALEcYwSpGTviEEgAAAG8II1hJi4DgTNAQNZCIul0rm/3uETUBAMBQ/8zeABjscdL1fePPnv0zZ3+LdX2qM7UEAEB6VkawsjMrHO7eOY7y6EaEbeCeKLUEAACXWRnB6u6slMjwe69+lxparbpRGwAADCeMgN9GT8qef69XOGGyCQAAhCKMgDh6rJoQRNR3Z4WE+gAAYAphBMT0bpJ4ZNJpkgkAAIQljIB8BA3cpYYAAJhKGAFQw5HHNYQQAACEIIwAqEXgAABAeL9mbwAAAACwlv8AQ33/MkPf6K8AAAAASUVORK5CYII="
      alt=""
      style={{ width: 160, height: 36, objectFit: 'contain', opacity: 1 }}
    />
  )
}

/* ══════════════════════════════════════════════════════
   ICÔNE +✦ exacte du design
══════════════════════════════════════════════════════ */
function MagicStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#E8A0B4" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════
   CATÉGORIES
══════════════════════════════════════════════════════ */
const CATEGORIES = [
  { label: 'Skincare',  img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&q=80', bg: '#FFE8EF', border: '#F9C8D4' },
  { label: 'Makeup',    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80', bg: '#EBE0FF', border: '#C9ADE8' },
  { label: 'Body Care', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=160&h=160&fit=crop&q=80', bg: '#9B5FC0', border: '#7B3FA0' },
  { label: 'Hair Care', img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=160&h=160&fit=crop&q=80', bg: '#C8EDE0', border: '#A0D8C8' },
]

/* ══════════════════════════════════════════════════════
   CARTE PRODUIT
══════════════════════════════════════════════════════ */
function ProductCard({ product }) {
  const { toggle, isWished } = useWishlist()
  const liked    = isWished(product._id)
  const img     = product.images?.[0] || '/placeholder.jpg'
  const rating  = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    if (!isWished(product._id)) toast.success('💜 Ajouté à ta wishlist !', { duration: 2000 })
    else toast('🤍 Retiré de ta wishlist', { duration: 1500 })
  }

  return (
    <Link to={`/products/${product._id}`} className="flex-shrink-0 block" style={{ width: 128 }}>
      <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 2px 12px rgba(155,95,192,0.09)', overflow: 'hidden' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
          <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <button onClick={handleWishlist}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: liked ? 'rgba(232,160,180,0.95)' : 'rgba(255,255,255,0.88)' }}>
            <Heart size={12} style={{ fill: liked ? 'white' : 'none', color: liked ? 'white' : '#C4B0D8', strokeWidth: 2 }} />
          </button>
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
               style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Star size={8} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: '8px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
            <span style={{ fontSize: '8px', color: '#B8A8C8' }}>({reviews})</span>
          </div>
        </div>
        <div style={{ padding: '8px 10px 10px' }}>
          <p style={{ fontSize: '10px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2D2340', lineHeight: 1.3, marginBottom: 6, minHeight: 28 }}
             className="line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D2340' }}>
              {(product.price ?? 0).toFixed(0)} DA
            </span>
            <button onClick={(e) => e.preventDefault()}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#9B5FC0' }}>
              <Plus size={12} color="white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ══════════════════════════════════════════════════════
   EN-TÊTE DE SECTION
══════════════════════════════════════════════════════ */
function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-3 px-5">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>{title}</span>
        <FloralBranch />
      </div>
      <Link to={to} style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
            className="hover:opacity-70 flex-shrink-0">See All</Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   PAGE HOME
══════════════════════════════════════════════════════ */
function HomePage() {
  const [trending, setTrending] = useState([])
  const [arrivals, setArrivals] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setTrending(all.slice(0, 8))
        setArrivals([...all].reverse().slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const Skeleton = () => (
    <div className="flex gap-2.5 px-5 overflow-hidden">
      {[1,2,3,4].map(i => (
        <div key={i} className="flex-shrink-0 animate-pulse"
             style={{ width: 128, height: 195, background: 'rgba(255,255,255,0.7)', borderRadius: 18 }} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-4" style={{ background: '#FEF0F8' }}>

      {/* ════════════════════════════════════════
          HERO — photo plein container, texte par-dessus
      ════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-5 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 248 }}>

          {/* Photo plein container — AUCUN texte alternatif visible */}
          <img
            src="/images/images.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ display: 'block' }}
            onError={(e) => {
              // Si l'image ne charge pas, fond dégradé de remplacement
              e.target.style.display = 'none'
              e.target.parentElement.style.background =
                'linear-gradient(135deg, #8B6AAE 0%, #B896D4 40%, #C8A87E 80%, #D4B896 100%)'
            }}
          />

          {/* Overlay gauche pour lisibilité du texte */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(110deg, rgba(80,40,130,0.55) 0%, rgba(80,40,130,0.25) 52%, transparent 100%)' }} />

          {/* Bloc texte glassmorphism — posé par-dessus la photo */}
          <div className="absolute"
               style={{
                 left: 16,
                 top: '50%',
                 transform: 'translateY(-50%)',
                 background: 'rgba(255,255,255,0.13)',
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
                 borderRadius: 18,
                 border: '1px solid rgba(255,255,255,0.30)',
                 padding: '16px 18px',
                 maxWidth: '57%',
               }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', marginBottom: 4 }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: 6 }}>
              Fairy Glow
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: 13 }}>
              Japanese essences infused<br />with morning dew magic.
            </p>
            <Link to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'white', color: '#3D2060',
                fontWeight: 700, fontSize: '12px',
                borderRadius: 50, padding: '8px 16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
                whiteSpace: 'nowrap',
              }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP BY MAGIC
      ════════════════════════════════════════ */}
      <section className="pb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between mb-4 px-5">
          <div className="flex items-center gap-1.5">
            <MagicStar />
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>Shop by Magic</span>
            <FloralBranch />
          </div>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
                className="hover:opacity-70 flex-shrink-0">See All</Link>
        </div>
        <div className="grid grid-cols-4 gap-1 px-5">
          {CATEGORIES.map(({ label, img, bg, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 55}ms` }}>
              <div className="rounded-full overflow-hidden"
                   style={{ width: 72, height: 72, background: bg, border: `2.5px solid ${border}`, boxShadow: '0 2px 10px rgba(155,95,192,0.13)' }}>
                <img src={img} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A4A6A', textAlign: 'center' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRENDING NOW
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionHeader title="Trending Now" to="/products" />
        {loading ? <Skeleton /> : trending.length > 0 ? (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: '#B8A8C8', fontSize: 14 }}>No products yet 🌸</p>
        )}
      </section>

      {/* ════════════════════════════════════════
          NEW ARRIVALS
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionHeader title="New Arrivals" to="/products" />
        {!loading && arrivals.length > 0 && (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map(p => <ProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* ── Clean Japanese Beauty ── */}
        <div className="mx-5 mt-4 rounded-3xl overflow-hidden relative text-center"
             style={{
               background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 28%, #D6EEFF 55%, #D6FFE8 78%, #FFF0D6 100%)',
               padding: '32px 20px 28px',
             }}>
          <span className="absolute top-3 left-5" style={{ fontSize: 11, color: '#C9ADE8', opacity: 0.7 }}>✦</span>
          <span className="absolute top-3 right-6" style={{ fontSize: 9, color: '#F9C8D4', opacity: 0.7 }}>✦</span>
          <svg className="mx-auto mb-3" width="34" height="34" viewBox="0 0 36 36" fill="none">
            <path d="M18 30 C18 30 6 22 6 14 C6 9 10 6 14 8 C15.5 8.5 17 10 18 12 C19 10 20.5 8.5 22 8 C26 6 30 9 30 14 C30 22 18 30 18 30Z"
                  fill="#9B5FC0" opacity="0.85"/>
            <path d="M18 30 C18 30 11 24 10 18 C13 19 16 22 18 26 C20 22 23 19 26 18 C25 24 18 30 18 30Z"
                  fill="#7B3FA0" opacity="0.7"/>
            <path d="M18 12 C18 12 16 8 18 5 C20 8 18 12 18 12Z" fill="#C9ADE8"/>
          </svg>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#4A3070', lineHeight: 1.1, marginBottom: 8 }}>
            Clean Japanese Beauty
          </p>
          <p style={{ fontSize: '13px', color: '#7A6888', lineHeight: 1.65 }}>
            Curated with love from Tokyo to your doorstep.<br />
            Cruelty-free and magical.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage