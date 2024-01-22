import React from 'react'

function LeaderboardTable() {
  return (
    <table id="example" className="display" style={{width: '100%'}}>
      <thead>
        <tr>
          <th>Username</th>
          <th>number games</th>
          <th>Rank</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ruth Sanchez</td>
          <td>-80</td>
          <td>35</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Username</th>
          <th>Global Score</th>
          <th>Rank</th>
        </tr>
      </tfoot>
    </table>
  )
}

export default LeaderboardTable
