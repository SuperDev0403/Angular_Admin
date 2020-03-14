<?php
ob_start();
if(strpos(__FILE__, "/")=== false){
    $path= str_replace("application\cron\import.php", "", __file__);
}else{
    $path= str_replace("application/cron/import.php", "", __file__);
}

require($path . "index.php");
ob_end_clean();
$ci = get_instance();
$i = new Import($ci);
class Import{
    function __construct($ci){
        $this->init();
    }
    function init(){
        ini_set('max_execution_time', 18000000000);
        $url = "http://devdashboard.azzgency.com/api/cron/start";
        $content = @file_get_contents($url);        
        echo "importación correcta";
    }
}

?>    