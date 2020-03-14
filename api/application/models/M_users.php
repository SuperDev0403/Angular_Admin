<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_users extends CI_Model{
	
	protected $user_table = 'users';
	
	function get_user($email) {
        $sql = "SELECT * FROM users, client WHERE email='".$email."' AND is_active=1 AND users.client_id=client.client_id AND client.client_is_active=1";
        $result = $this->db->query($sql)->result();
        return $result;
	}

	public function check_email_exists($email) {
        $this->db->select('id')->from($this->user_table);
        $this->db->where('email',$email);

        $result = $this->db->get()->row();

        if ($result) {
            return $result;
        } else {
            return 0;
        }
        
    }

    public function insert_user($data) {

        $this->db->insert($this->user_table, $data);
        $result = $this->db->insert_id();

        if ($result) {
            return $result;
        } else {
            return 0;
        }
	}

    public function delete_user($id) {
        $this->db->where('id', $id);
        $result = $this->db->delete($this->user_table);
        return $result;
    }

    public function edit_user($id, $data) {
        $this->db->where('id', $id);
        $result = $this->db->update($this->user_table, $data);
        return $result;
    }
	
	public function getClients() {
		$this->db->from($this->user_table);
		$this->db->where('role', 'client');
		$result = $this->db->get()->result();
		return $result;
	}
    
    public function getUsers() {
        $sql = "SELECT users.id AS id, email, name, role, is_active, client_name, users.client_id AS client_id FROM users, client WHERE users.client_id=client.client_id";
        $result = $this->db->query($sql)->result();
		return $result;
    }
}