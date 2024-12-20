const CountryFilter = ({filter, handleFilter}) => {
  return (
    <div>
      Find countries <input value={filter} onChange={handleFilter}></input>
    </div>
  )
}
export default CountryFilter;