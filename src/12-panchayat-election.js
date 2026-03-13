/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
// used ai for this 
export function createElection(candidates) {
  // Your code here
  const voters = new Map();
  const votedIds = new Set();
  const tally = {};
  const candidateMap = {};
  candidates.forEach(c => {
    tally[c.id] = 0;
    candidateMap[c.id] = c;
  });

  return {
    registerVoter(voter){
      if (!voter || !voter.id || !voter.name || !voter.age) return false;
      if(voter.age < 18) return false;
      if(voters.has(voter.id)) return false;
      voters.set(voter.id,voter);
      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError){
      if(!voters.has(voterId)) return onError('Voter not registered');
      if(!(candidateId in tally)) return onError('Invalid candidate');
      if(votedIds.has(voterId)) return onError('Already voted');
      votedIds.add(voterId);
      tally[candidateId]++;
      return onSuccess({voterId,candidateId});
    },

    getResults(sortFn){
      const results = Object.entries(tally).map(([id,votes]) => ({...candidateMap[id], votes}));      const defaultSort = (a,b) => b.votes - a.votes;
      return results.sort(sortFn || defaultSort);
    },

    getWinner(){
      const results = this.getResults();
      if(results.every(r => r.votes === 0)) return null;
      return  results[0];
    }
  };
}


export function createVoteValidator({minAge, requiredFields}) {
  // Your code here
  return function(voter){
    if(!voter) return {valid: false, reason: 'No voter provided'};
    for(const field of requiredFields){
      if(!(field in voter)) return {valid: false, reason: `Missing field: ${field}`};
    }
    if(voter.age < minAge) return {valid: false, reason: `Voter must be at least ${minAge}`};
    return {valid: true};  
  };
}

export function countVotesInRegions(regionTree) {
  // Your code here
  if(!regionTree) return 0;
  const subTotal = (regionTree.subRegions || []).reduce((sum,sub) => sum + countVotesInRegions(sub),0);
  return (regionTree.votes || 0) + subTotal;
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  return { 
    ...currentTally, [candidateId]: (currentTally[candidateId] || 0) + 1 

  };
}
